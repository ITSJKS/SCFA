t = int(input())
for _ in range(t):
    a,b = map(int,input().split())
    l = list(map(int,input().split()))
    n = len(l)
    flag = False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if l[i]+l[j]+l[k]==b:
                    flag = True
                    break
    if flag:
        print("YES")
    else:
        print("NO")