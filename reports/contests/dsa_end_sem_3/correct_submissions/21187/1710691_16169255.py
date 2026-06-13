# Your code here
N = int(input())
mat = []
for i in range(N):
    lst = list(map(int,input().split()))
    mat.append(lst)
L = []
S = []
for i in range(N):
    for j in range(N):
        if i==j:
            S.append(mat[i][j])
        if j==N-i-1:
            L.append(mat[i][j])
found = True

for i in range(N-1):
    if L[i]!=L[i+1] or S[i]!=S[i+1]:
        found = False
        break
if found:
    print("Double Harmony")
else:
    print("No Harmony")