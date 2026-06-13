n=int(input())
mat=[]
for _ in range(n):
    mat.append(list(map(int,input().split())))
a=mat[0][0]
b=mat[0][-1]
d="Double Harmony"
for i in range(n):
    for j in range(n):
        if i==j and mat[i][j]!=a or i+j==n-1 and mat[i][j]!=b:
            d="No Harmony"
print(d)