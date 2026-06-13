n=int(input())
arr=[list(map(int,input().split())) for i in range(n)]
target1=arr[0][0]
target2=arr[0][n-1]
satisfy=True
for i in range(n):
    for j in range(n):
        if i==j: 
            if arr[i][j]!=target1:
                satisfy=False
                break
        if i+j==n-1:
            if arr[i][j]!=target2:
                satisfy=False
                break
if satisfy:
    print("Double Harmony")
else:
    print("No Harmony")