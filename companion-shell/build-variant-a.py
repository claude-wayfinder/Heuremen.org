import numpy as np, trimesh, os
from trimesh.creation import cylinder, annulus, box
from trimesh.transformations import rotation_matrix as rot
SECT=120
def cyl(r,h,z0):
    m=cylinder(radius=r,height=h,sections=SECT); m.apply_translation([0,0,z0+h/2]); return m
def ann(rmin,rmax,h,z0):
    m=annulus(r_min=rmin,r_max=rmax,height=h,sections=SECT); m.apply_translation([0,0,z0+h/2]); return m
def boxt(ext,ctr):
    m=box(extents=ext); m.apply_translation(ctr); return m

# ===== BASE =====  OD78 r39; speaker cavity z2.5..51; VENTED COLLAR z51..63
HB=63.0
base=cyl(39,HB,0)
base=base.difference(cyl(34,HB-2.5+0.1,2.5))                 # open bore z2.5..63 (speaker + air chamber)
base=base.union(ann(34,35.5,1.5,HB))                         # rabbet tongue at z63
# USB-C (+X) 14x8 @5 above floor -> z7.5..15.5
base=base.difference(boxt([12,14,8],[39,0,11.5]))
# 2 side vents (+Y,-Y) 12x6 @20 above floor -> z22.5..28.5
base=base.difference(boxt([12,10,6],[0,39,25.5]))
base=base.difference(boxt([12,10,6],[0,-39,25.5]))
# ESP32 boss + pocket + USB slot (-X)
base=base.union(boxt([6,26,34],[-40,0,17]))
base=base.difference(boxt([6.5,19.5,24],[-37.25,0,18.5]))
base=base.difference(boxt([12,11,5],[-38,0,9]))
# wire channel up inner wall -> now to z63
base=base.difference(boxt([2,3,35],[-35,0,45.5]))            # z28..63
# speaker retention bumps @ z28
for a in (30,150,270):
    x,y=33.5*np.cos(np.radians(a)),33.5*np.sin(np.radians(a))
    base=base.union(boxt([2.0,3.0,3.0],[x,y,28]))
# COLLAR WINDOWS: 6 openings in band z51..60 for lateral sound escape
for a in (30,90,150,210,270,330):
    w=box(extents=[16,18,9]); w.apply_translation([37,0,55.5]); w.apply_transform(rot(np.radians(a),[0,0,1]))
    base=base.difference(w)
# alignment pins (+X,-X) on rim z63
p1=cyl(0.75,2,HB); p1.apply_translation([38,0,0]); base=base.union(p1)
p2=cyl(0.75,2,HB); p2.apply_translation([-38,0,0]); base=base.union(p2)

# ===== RING SHELF =====  unchanged geometry, holes moved to +-X to match pins
shelf=cyl(39,4,0)
shelf=shelf.difference(cyl(22,4.2,-0.1))                     # Ø44 aperture
shelf=shelf.difference(ann(17,26.75,2.1,2))                  # groove 53.5/34/2 (16-LED)
shelf=shelf.difference(boxt([23,8,4.2],[-28.5,0,2]))         # wire notch (-X)
shelf=shelf.difference(ann(34,35.5,1.55,-0.01))             # rabbet recess
h1=cyl(0.8,2.6,-0.01); h1.apply_translation([38,0,0]); shelf=shelf.difference(h1)
h2=cyl(0.8,2.6,-0.01); h2.apply_translation([-38,0,0]); shelf=shelf.difference(h2)

# ===== CAGE (Variant A) =====  unchanged
R=50.8; ZC=45.8; RIB=2.0
zap=ZC+R*np.sin(np.radians(60))
parts=[ann(36,39,3,0), ann(26,28.5,3,zap-1.5)]
for k in range(3):
    th=np.radians(120*k); pts=[]
    for z in np.linspace(0,13.3,4): pts.append((39.0,z))
    for z in np.linspace(13.3,zap,42):
        rs=np.sqrt(max(R*R-(z-ZC)**2,0)); pts.append((rs,z))
    P=np.array([[r*np.cos(th),r*np.sin(th),z] for r,z in pts])
    for i in range(len(P)-1):
        if np.linalg.norm(P[i+1]-P[i])>1e-4:
            parts.append(cylinder(radius=RIB,segment=[P[i],P[i+1]],sections=20))
cage=trimesh.boolean.union(parts)
cage=max(cage.split(only_watertight=False),key=lambda b:b.volume)
cage.merge_vertices(); cage.update_faces(cage.nondegenerate_faces()); cage.update_faces(cage.unique_faces())
cage.remove_unreferenced_vertices(); cage.fix_normals()

def rpt(n,m):
    e=m.bounds[1]-m.bounds[0]
    print(f"[{n}] watertight={m.is_watertight} bodies={m.body_count} vol_cm3={m.volume/1000:.2f} bbox={e[0]:.1f}x{e[1]:.1f}x{e[2]:.1f}")
rpt("BASE",base); rpt("SHELF",shelf); rpt("CAGE",cage)
os.makedirs("/tmp/cs4",exist_ok=True)
for n,m in [("base",base),("ring-shelf",shelf),("cage",cage)]: m.export(f"/tmp/cs4/{n}.stl")
print("exported")
