t = int(input())
for _ in range(t):
    n,ta=map(int,input().split())
    arr=list(map(int,input().split()))
    a=False
    for i in range(n-2):
        for j in range(i+1,n-1):
            for k in range(j+1,n):
                if arr[i]+arr[j]+arr[k] == ta:
                    a=True
                    break
            if a:
                break
        if a:
            break
    if a:
        print("YES")
    else:
        print("NO")