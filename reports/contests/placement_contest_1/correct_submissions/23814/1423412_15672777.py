# def firstOccurrence(nums):
#     # for _ in range(t):
#     #     for i in range(n):
#     #         if nums[i]==1:
#     #             return i 
#     #     return -1

#     s=0
#     e=n 

#     for _ in range(t):
#         for i in range(n//2):
#             if 1 in nums:
#                 while s<e :
#                     mid=(e+s)//2
#                     if nums[mid]==1:
#                         mid=s
#                         s+=1
#                     else:
#                         mid=e-1
#                     return mid
#             return -1
def firstOccurrence(nums):
    s = 0
    e = len(nums) - 1
    ans = -1

    while s <= e:
        mid = (s + e) // 2

        if nums[mid] == 1:
            ans = mid      # possible answer
            e = mid - 1    # move left to find earlier 1
        else:
            s = mid + 1    # move right

    return ans