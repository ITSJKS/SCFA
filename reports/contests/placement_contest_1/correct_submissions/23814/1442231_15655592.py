# def firstOccurrence(nums):

#     ans=-1
#     left=0
#     right=len(nums)-1

#     while left<=right:
#         if nums[left]==1:
#             ans=left
#             break
            
#         mid=left + (right-left)//2
#         if nums[mid]==2:
#             left=mid+1
#         else:
#             if nums[mid-1]==2:
#                 return mid
#             else:
#                 return mid -1
#     return ans

def firstOccurrence(nums):
    left = 0
    right = len(nums) - 1
    ans = -1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == 1:
            ans = mid
            right = mid - 1   # move left to find first 1
        else:  # nums[mid] == 2
            left = mid + 1

    return ans