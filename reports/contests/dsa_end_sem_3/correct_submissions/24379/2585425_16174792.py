n=int(input())
x=list(map(int,input().split()))
d=[]
for i in range(n):
    if x[i]>0:
        d.append(x[i])
    else:
        if d==[] or d[-1]<0:
            d.append(x[i])
        elif abs(x[i])<d[-1]:
            continue
        elif abs(x[i])==d[-1]:
            d.pop()
        else:
            while d and d[-1]<abs(x[i]):
                if d[-1]<0:
                    break
                d.pop()
            if d==[] or d[-1]<0:
                d.append(x[i])

if d:
    for i in d:
        print(i,end=" ")
else:
    print(*[])