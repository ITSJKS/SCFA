t = int(input())
for _ in range(t):
    f=False
    a,b=map(int,input().split())
    l=list(map(int,input().split()))
    for i in range (a):
        for j in range (i+1,a):
            for k in range (j+1,a):
                if l[i]+l[j]+l[k]==b:
                    f=True
                    break
    if f==True:
        print("YES")
    else:
        print("NO")