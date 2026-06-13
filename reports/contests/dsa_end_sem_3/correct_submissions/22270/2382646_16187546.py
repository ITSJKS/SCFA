from bisect import bisect_left
def isPresent(n, nums, target):

    idx = bisect_left(nums[::-1],target)
    
    if nums[len(nums) - 1 - idx] == target: 
        return (len(nums) - 1 - idx)
    else:
        return -1


    # left = 0 
    # right = n - 1

    # while left >= n:
    #     mid = (left + right) // 2

    #     if nums[mid] > mid :