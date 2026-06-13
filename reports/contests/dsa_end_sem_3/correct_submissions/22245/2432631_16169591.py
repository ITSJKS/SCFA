t = int(input())
for _ in range(t):
    n,t=map(int,input().split())
    a=list(map(int,input().split()))
    x=False
    for i in range(n):
        for j in range(i,n):
            for k in range(i+2,n):
                if a[i]+a[j]+a[k]==t:
                    if i==j or j==k:
                        continue
                    x=True
                    break
    if x:
        print("YES")
    else:
        print("NO")