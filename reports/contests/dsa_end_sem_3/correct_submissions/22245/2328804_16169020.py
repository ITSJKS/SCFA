t = int(input())
for _ in range(t):
    a,b=map(int,input().split())
    l=list(map(int,input().split()))
    flag1=False
    for i in range(a):
        for j in range(i+1,a):
            for k in range(j+1,a):
                if l[i]+l[j]+l[k]==b:
                    print("YES")
                    flag1=True
                    break
            if flag1:
                break
        if flag1:
            break
    else:
        print("NO")