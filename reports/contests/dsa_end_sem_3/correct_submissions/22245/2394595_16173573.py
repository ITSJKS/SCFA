t = int(input())
for _ in range(t):
    n,target = map(int,input().split())
    arr = list(map(int,input().split()))
    a=0
    for i in range(len(arr)):
        for j in range(i+1,len(arr)):
            for k in range(j+1,len(arr)):
                if arr[i]+arr[j]+arr[k]==target:
                    a=1
    if a==1:
        print("YES")
    else:
        print("NO")