t = int(input())
for _ in range(t):
    d="NO"
    a,b=map(int,input().split())
    x=list(map(int,input().split()))
    for i in range(len(x)-2):
        for j in range(i+1,len(x)-1):
            for k in range(j+1,len(x)):
                if x[i]+x[j]+x[k]==b:
                    d="YES"
    print(d)