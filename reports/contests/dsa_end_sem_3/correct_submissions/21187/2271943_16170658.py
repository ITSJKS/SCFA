# Your code here
n = int(input())
mat = []
for _ in range(n):
    mat.append(list(map(int,input().split())))
x = []
y = [] 
for i in range(n):
    for j in range(n):
        if(i==j):
            x.append(mat[i][j])
        if(i+j==n-1):
            y.append(mat[i][j])
checkx = True 
checky = True
for i in range(len(x)-1):
    if x[i] != x[i+1]:
        checkx = False
        break 
for i in range(len(y)-1):
    if y[i] != y[i+1]:
        checky = False
        break 
if(checkx and checky):
    print('Double Harmony')
else: print('No Harmony')