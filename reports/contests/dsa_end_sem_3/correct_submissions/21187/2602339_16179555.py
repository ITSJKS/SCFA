n=int(input())
mat=[]
for _ in range(n):
    mat.append(list(map(int,input().split())))
a1=[]
for i in range(n):
    for j in range(n):
        if i==j:
            a1.append(mat[i][j])
a2=[]
for i in range(n):
    for j in range(n):
        if i+j==n-1:
            a2.append(mat[i][j])

z=a1[0]
m=a2[0]
if (a1.count(z))==(a2.count(m))==n:
    print("Double Harmony")
else:
    print("No Harmony")