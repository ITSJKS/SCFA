n = int(input())

mat = []
for i in range(n):
    arr = list(map(int, input().split()))
    mat.append(arr)

flag1 = True
for i in range(1, n):
    if mat[i][i] != mat[i - 1][i - 1]:
        flag1 = False
        break

flag2 = True
last = mat[0][n - 1]

l, r = 1, n - 2
for i in range(n - 1):
    curr = mat[l][r]
    if curr != last:
        flag2 = False
        break
    last = curr

print("Double Harmony" if flag1 and flag2 else "No Harmony")