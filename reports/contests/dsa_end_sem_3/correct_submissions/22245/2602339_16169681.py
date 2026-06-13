t = int(input())
for _ in range(t):
    # Write your code here
    m=1
    n,x=map(int,input().split())
    l=list(map(int,input().split()))
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if l[i]+l[j]+l[k]==x:
                    print("YES")
                    m=0
                    break
            if m==0:
                break
        if m==0:
            break
    if m==1:
        print("NO")