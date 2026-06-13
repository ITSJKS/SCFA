t = int(input())
for _ in range(t):
    n,x=map(int,input().split())
    li = list(map(int,input().split()))
    ans = False
    for i in range(n):
        for j in range(n):
            for k in range(n):
                if i!=j and j!=k and i!=k:
                    if li[i]+li[j]+li[k]==x:
                        ans = True
                        
                        break
            

    if ans:
        print("YES")
    else:
        print("NO")