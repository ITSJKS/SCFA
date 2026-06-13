a=int(input())
l=[list(map(int,input().split())) for i in range(a)]
x=l[0][0]
y=l[0][a-1]
flag1=False
flag2=False
for i in range(a):
    for j in range(a):
        if i==j and l[i][j]!=x:
            flag1=True
        if i+j==a-1 and l[i][j]!=y:
            flag2=True
print("Double Harmony" if (not flag1 and not flag2) else "No Harmony")