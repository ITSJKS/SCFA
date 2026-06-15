n=int(input())
arr=[]
for i in range(n):
    arr.append(list(map(int,input().split())))
l=arr[0][0]
r=arr[0][n-1]
c=0
for i in range(n):
    if arr[i][i]!=l or arr[i][n-1-i]!=r:
        c=1
        break
if c==1:
    print("No Harmony")
else:
    print("Double Harmony")