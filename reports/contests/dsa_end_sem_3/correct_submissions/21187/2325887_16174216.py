n = int(input())
mat = []

for i in range(n):
    lst = list(map(int, input().split()))
    mat.append(lst)

flag1 = True
val1 = 0
flag2 = True
val2 = 0

for i in range(n):
    if i==0:
        val1 = mat[i][i]
    else:
        if mat[i][i]!=val1:
            flag1 = False
            break


for i in range(n):
    if i==0:
        val2 = mat[i][n-1-i]
    else:
        if mat[i][n-1-i]!=val2:
            flag2 = False
            break



if flag1 and flag2:
    print('Double Harmony')
else:
    print('No Harmony')