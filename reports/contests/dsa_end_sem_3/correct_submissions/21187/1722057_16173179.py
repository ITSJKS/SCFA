# Your code here
x=int(input())
mat =[]
for _ in range(x):
    lst=list(map(int,input().split()))

    mat.append(lst)
ans = True
for i in range(x):
    for j in range(x):
        if i==j:
            if (mat[i][j]!=mat[0][0]):
                ans= False
                break
               
        if i+j == x-1:
            if(mat[0][x-1]!=mat[i][j]):
                ans= False
                break
    if not ans:
        break
if ans:
    print('Double Harmony')
else:
    print('No Harmony')