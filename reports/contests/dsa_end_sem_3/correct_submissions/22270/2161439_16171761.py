def isPresent(n, nums, target):
    start = 0
    end = len(nums)
    while end > start:
        mid = (end+start)//2
        if nums[mid] == target:
            return mid
        elif nums[mid] > target:
            start = mid+1
        else:
            end = mid
    return -1