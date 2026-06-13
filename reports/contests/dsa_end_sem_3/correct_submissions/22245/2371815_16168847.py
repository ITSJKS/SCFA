t = int(input())
for _ in range(t):
    # Write your code here
    n,t=map(int,input().split())
    arr=list(map(int,input().split()))
    ans=False
    for i in range(n-2):
        for j in range(i+1,n-1):
            for k in range(j+1,n):
                if(arr[i]+arr[j]+arr[k]==t):
                    ans=True
    if(ans):
        print("YES")
    else:
        print("NO")