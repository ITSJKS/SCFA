t = int(input())
for _ in range(t):
    # Write your code here
    n,m=map(int,input().split())
    l=list(map(int,input().split()))
    x= False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if l[i]+l[j]+l[k]==m:
                    x=True
                    break
            if x:
                break
        if x:
            break
    if x:
        print("YES")
    else:
        print("NO")