t = int(input())
for _ in range(t):
    n,target=map(int,input().split())
    arr=list(map(int,input().split()))
    flag=False
    n=len(arr)
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if arr[i]+arr[j]+arr[k]==target:
                    flag=True
                    break
    if flag:
        print("YES")
    else:
        print("NO")