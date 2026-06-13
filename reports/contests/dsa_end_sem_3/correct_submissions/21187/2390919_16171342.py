n = int(input())
arr = []
for i in range(n):
    arr.append(list(map(int, input().split())))
a = []
c = []
b = False

for i in range(n):
    for j in range(n):
        if i == j:
            a.append(arr[i][j])

for i in range(n-1):
    if a[i] != a[i+1]:
        b = True
        print("No Harmony")
        break

if b == False:
    for i in range(n):
        for j in range(n):
            if i + j == n-1:
                c.append(arr[i][j])

    for i in range(n-1):
        if c[i] != c[i+1]:
            b = True
            print("No Harmony")
            break

    if b == False:
        print("Double Harmony")