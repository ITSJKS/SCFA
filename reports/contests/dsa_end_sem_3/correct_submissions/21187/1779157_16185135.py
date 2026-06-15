n = int(input())
matrix = []
for i in range(n):
    temp = list(map(int,input().split()))
    matrix.append(temp)
a = True
b = True
c = matrix[0][0]
d = matrix[0][n-1]
if n == 0 :
    a = False
    b = False
elif n==1:
    a = True
    b = True
else:
    for i in range(n):
        for j in range(n):
            if i==j:
                if matrix[i][j] != c:
                    a = False
            if i + j == n - 1:
                if matrix[i][j] != d:
                    b = False
if a and b:
    print('Double Harmony')
else:
    print('No Harmony')