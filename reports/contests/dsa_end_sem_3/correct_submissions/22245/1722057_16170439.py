t = int(input())
for _ in range(t):
    n,x=map(int,input().split())
    l=list(map(int,input().split()))
    ans=False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if(l[i]+l[j]+l[k]==x):
                    ans=True
                    break
            if ans:
                break
        if ans:
            break
    if ans:
        print('YES')
    else:
        print('NO')