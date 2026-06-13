a,b=map(int,input().split())
if a%2==1:
    print(*range(a,b+1,2))
else:
    print(*range(a+1,b+1,2))