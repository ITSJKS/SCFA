t = int(input())
for _ in range(t):
    n,tar = map(int,input().split())
    arr = list(map(int,input().split()))
    f = 0
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if arr[i] + arr[j] + arr[k] == tar:
                    
                    f = 1
                    break
    if f == 1:
        print("YES")
    if f == 0:
        print("NO")