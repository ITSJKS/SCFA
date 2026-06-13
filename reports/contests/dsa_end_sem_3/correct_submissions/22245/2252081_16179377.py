t = int(input())
for _ in range(t):
    n,target = map(int , input().split())
    nums = list(map(int , input().split()))
    is_present = "NO"
    for i in range(n-2):
        for j in range(i+1,n-1):
            for k in range(j+1,n):
                if nums[i]+nums[j]+nums[k] == target:
                    is_present = "YES"
                    break
    print(is_present)



# t = int(input())
# for _ in range(t):
#     n,target = map(int , input().split())
#     nums = list(map(int , input().split()))
#     is_present = "NO"
#     for i in range(n):
#         for j in range(i+1,n):
#             if nums[i]+nums[j]==target:
#                 is_present = "YES"
#                 break
#     print(is_present)