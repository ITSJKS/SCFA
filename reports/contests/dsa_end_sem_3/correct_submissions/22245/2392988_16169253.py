t = int(input())
for _ in range(t):
    n , t = map(int ,input().split())
    l = list(map(int ,input().split()))
    hehe = False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if l[i] + l[j] + l[k] == t:
                    hehe = True
    if hehe:
        print("YES")
    else:
        print("NO")