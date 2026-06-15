# Your code here
n = int(input())
mat = []
for i in range(n):
    li = list(map(int,input().split()))
    mat.append(li)
def f(mat):
    a = mat[0][0]
    b = mat[0][-1]
    for i in range(n):
        for j in range(n):
            if i == j and a!=mat[i][j]:
                return "No Harmony"
            if i == n-j-1 and b!= mat[i][j]:
                return "No Harmony"
    return "Double Harmony"
print(f(mat))