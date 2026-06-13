n = int(input())
mat = []
arr1 = []
arr2 = []
count1 = 0
count2 = 0
for i in range(n):
    mat.append(list(map(int, input().split())))

for i in range(n):
    for j in range(n):
        if i == j:
            arr1.append(mat[i][j])
        if i+j == n-1:
            arr2.append(mat[i][j])

# print(arr1)
# print(arr2)

for i in range(n-1):
    if arr1[i] == arr1[i+1]:
        count1 += 1

for i in range(n-1):
    if arr2[i] == arr2[i+1]:
        count2 += 1
if count1 == n-1 and count2 == n-1:
    print("Double Harmony")
else:
    print("No Harmony")