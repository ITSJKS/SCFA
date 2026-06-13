def isPresent(n, nums, target):
    def binary(nums, target):
        l = 0
        r = len(nums) - 1
        ans = -1
        while l <= r:
            mid = (l+r)//2

            if nums[mid] == target:
                ans= mid
                break
            elif nums[mid] < target:
                r = mid -1
            else:
                l = mid +1
        return ans
    return binary(nums,target)