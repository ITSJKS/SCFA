n=int(input())
mat=[]
for _ in range(n):
    row=list(map(int,input().split()))
    mat.append(row)
is_primary=True
is_secondary=True
for i in range(len(mat)):
    for j in range(len(mat[0])):
        first=mat[0][0]
        second=mat[0][n-1]
        if i==j:
            if mat[i][j]!=first:
                is_primary=False
                break

        if i+j==n-1:
            if mat[i][j]!=second:
                is_secondary=False
                break
if(is_primary and is_secondary):
    print("Double Harmony")
else:
    print("No Harmony")