t = int(input())
for _ in range(t):
    c=0
    n,x=map(int,input().split())
    arr=list(map(int,input().split()))
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if (arr[i]+arr[j]+arr[k]) == x:
                    c=1
                    break
    if c==1:
        print("YES")
    else:
        print("NO")