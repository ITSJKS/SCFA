t = int(input())
for _ in range(t):
    # Write your code here
    f=False
    j,t=map(int,input().split())
    l=list(map(int,input().split()))
    for i in range(len(l)):
        for j in range(i+1,len(l)):
            for k in range(j+1,len(l)):
                if l[i]+l[j]+l[k]==t:
                    f=True
    if f:
        print("YES")
    else:
        print("NO")