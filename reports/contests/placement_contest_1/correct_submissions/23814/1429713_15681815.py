def firstOccurrence(nums):
    left = 0
    right = len(nums)-1
    ans = -1
    while left <= right:
        mid = (left+right) // 2
        if nums[mid] == 1:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans