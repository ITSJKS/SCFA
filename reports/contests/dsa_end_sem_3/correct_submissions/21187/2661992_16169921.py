n=int(input())
mat=[]
for _ in range(n):
    lis=list(map(int,input().split()))
    mat.append(lis)
single=True
a=mat[0][0]
for i in range(n):
    if mat[i][i]!=a:
        single=False
        break
if not single:
    print('No Harmony')
else:
    double=True
    b=mat[0][n-1]
    for i in range(n):
        if mat[i][n-i-1]!=b:
            double=False
            break
    if double:
        print('Double Harmony')
    else:
        print('No Harmony')