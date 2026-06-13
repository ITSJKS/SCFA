# Your code here
n = int(input())
mat = []
for i in range(n):
    mat.append(list(map(int,input().split())))
h1 = []
h2 = []
h1har = True
h2har = True
for i in range(n):
    h1.append(mat[i][i])
for i in range(n):
    h2.append(mat[i][n-i-1])
for i in range(n-1):
    if h1[i]!=h1[i+1]:
        h1har = False
        break
for i in range(n-1):
    if h2[i]!=h2[i+1]:
        h2har = False
        break
if h1har and h2har:
    print("Double Harmony")
else:
    print("No Harmony")