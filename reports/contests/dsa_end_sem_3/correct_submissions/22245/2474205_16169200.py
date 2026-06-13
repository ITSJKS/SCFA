t = int(input())
for _ in range(t):
    n,target=map(int,input().split())
    l=list(map(int,input().split()))
    found=False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if l[i]+l[j]+l[k]==target:
                    found=True
    if found:
        print("YES")
    else:
        print("NO")