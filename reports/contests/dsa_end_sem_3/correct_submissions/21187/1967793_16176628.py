n=int(input())
mat=[]
for i in range(n):
    l=list(map(int,input().split()))
    mat.append(l)
a=mat[0][0]
b=mat[0][n-1]
f=0
for i in range(n):
    for j in range(n):
        if i==j:
            if mat[i][j]!=a:
                print("No Harmony")
                f=1
                break
        if i+j==n-1:
            if mat[i][j]!=b:
                print("No Harmony")
                f=1
                break
    if f!=0:
        break
if f==0:
    print("Double Harmony")