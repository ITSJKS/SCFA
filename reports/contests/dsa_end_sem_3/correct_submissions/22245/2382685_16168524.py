t = int(input())
for _ in range(t):
    n,target=map(int,input().split())
    arr=list(map(int,input().split()))
    found=False
    for i in range(len(arr)):
        for j in range(i+1,len(arr)):
            for k in range(j+1,len(arr)):
                if arr[i]+arr[j]+arr[k]==target:
                    found=True
                    break
    if found:
        print("YES")
    else:
        print("NO")

    # Write your code here