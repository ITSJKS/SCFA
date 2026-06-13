t = int(input())
for _ in range(t):
    n,target = map(int,input().split())
    arr = list(map(int,input().split()))
    a = False
    for i in range(n):
        for j in range(n):
            for k in range(n):
                if arr[i]+arr[j]+arr[k]==target and i!=j and i!=k and j!=k:
                    a = True
    if a: print("YES")
    else: print("NO")