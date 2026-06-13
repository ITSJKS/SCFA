def isPresent(n, nums, target):
    start = 0
    end = n-1
    while start<=end:
        mid = (start+end)//2
        if nums[mid]==target:
            return mid
        elif nums[mid]<target:
            end = mid - 1
        else:
            start = mid + 1
    if nums[mid]!=target or mid<n:
        return -1
    return mid