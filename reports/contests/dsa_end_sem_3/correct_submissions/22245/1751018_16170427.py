def check(L,length,target):
    for i in range(length-2):
        for j in range(i+1,length-1):
            for k in range(j+1,length):
                if L[i]+L[k]+L[j]==target:
                    # print(i,j,k)
                    return "YES"

    return "NO"


t = int(input())
for _ in range(t):
    n,target = map(int,input().split())
    nums = list(map(int,input().split()))
    print(check(nums,n,target))

    

    # Write your code here