a = int(input())
mat = []
for _ in range(a):
    arr = list(map(int,input().split()))
    mat.append(arr)

h = True

c = mat[0][0]
d = mat[0][a-1]
for i in range(a):
    if mat[i][i]!=c or mat[i][a-1-i]!=d:
        h = False
        break
    
if h == True:
    print("Double Harmony")
else:
    print("No Harmony")