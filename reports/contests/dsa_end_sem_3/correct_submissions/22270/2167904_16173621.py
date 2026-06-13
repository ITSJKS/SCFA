def isPresent(n, nums, target):
    l = 0
    r = n-1
    ans = -1
    while l<=r:
        mid = (l+r)//2
        if nums[mid] == target:
            ans = mid
            return ans
        elif(nums[mid] < target):
            r = mid - 1
        else:
            l = mid + 1
    return ans