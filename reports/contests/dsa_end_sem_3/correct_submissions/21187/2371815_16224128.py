n = int(input())

arr = []

for i in range(n):
    l = list(map(int, input().split()))
    arr.append(l)

a1 = []
a2 = []

j = 0
k = n - 1

for i in range(n):
    a1.append(arr[i][j])
    a2.append(arr[i][k])
    j += 1
    k -= 1

d1 = all(x == a1[0] for x in a1)
d2 = all(x == a2[0] for x in a2)

if d1 and d2:
    print("Double Harmony")
else:
    print("No Harmony")